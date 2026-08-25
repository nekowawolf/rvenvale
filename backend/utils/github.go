package utils

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"mime/multipart"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/mayahiro/go-webp"
	"github.com/nekowawolf/rvenvale/models"
)

func UploadToGitHub(file multipart.File, fileHeader *multipart.FileHeader) (string, string, string, int64, error) {
	token := os.Getenv("GITHUB_TOKEN")
	username := os.Getenv("GITHUB_USERNAME")
	repo := os.Getenv("GITHUB_REPO")
	baseDir := os.Getenv("GITHUB_UPLOAD_DIR")

	if token == "" || username == "" || repo == "" {
		return "", "", "", 0, fmt.Errorf("GitHub environment variables not set")
	}

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		return "", "", "", 0, fmt.Errorf("failed to read file: %v", err)
	}

	filename := fileHeader.Filename
	uploadBytes := fileBytes
	contentType := fileHeader.Header.Get("Content-Type")

	if IsImageContentType(contentType) && !strings.HasSuffix(strings.ToLower(filename), ".webp") {
		webpBytes, err := ConvertToWebP(fileBytes)
		if err != nil {
			fmt.Printf("WebP conversion failed, uploading original: %v\n", err)
		} else {
			uploadBytes = webpBytes
			if dotIdx := strings.LastIndex(filename, "."); dotIdx != -1 {
				filename = filename[:dotIdx] + ".webp"
			} else {
				filename = filename + ".webp"
			}
		}
	}

	encoded := base64.StdEncoding.EncodeToString(uploadBytes)

	now := time.Now()
	folderPath := fmt.Sprintf("%s/%d", baseDir, now.Year())
	uniqueFilename := fmt.Sprintf("%d_%s", now.Unix(), filename)
	fullPath := fmt.Sprintf("%s/%s", folderPath, uniqueFilename)

	uploadURL := fmt.Sprintf(
		"https://api.github.com/repos/%s/%s/contents/%s",
		username, repo, fullPath,
	)

	body := models.GitHubUploadRequest{
		Message: "Upload image via rvenvale API",
		Content: encoded,
	}

	jsonBody, err := json.Marshal(body)
	if err != nil {
		return "", "", "", 0, fmt.Errorf("failed to marshal body: %v", err)
	}

	req, err := http.NewRequest("PUT", uploadURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		return "", "", "", 0, err
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return "", "", "", 0, err
	}
	defer res.Body.Close()

	if res.StatusCode >= 300 {
		responseText, _ := io.ReadAll(res.Body)
		return "", "", "", 0, fmt.Errorf("GitHub upload failed (%d): %s", res.StatusCode, responseText)
	}

	var ghResp models.GitHubUploadResponse
	if err := json.NewDecoder(res.Body).Decode(&ghResp); err != nil {
		return "", "", "", 0, fmt.Errorf("failed to decode GitHub response: %v", err)
	}

	parts := strings.Split(ghResp.Content.Path, "/")
	for i, p := range parts {
		parts[i] = url.PathEscape(p)
	}
	escapedPath := strings.Join(parts, "/")

	finalURL := fmt.Sprintf("https://%s.github.io/%s/%s", username, repo, escapedPath)

	finalSize := int64(len(uploadBytes))

	return finalURL, ghResp.Content.Sha, ghResp.Content.Path, finalSize, nil
}

func DeleteFromGitHub(path, sha string) error {
	token := os.Getenv("GITHUB_TOKEN")
	username := os.Getenv("GITHUB_USERNAME")
	repo := os.Getenv("GITHUB_REPO")

	if token == "" || username == "" || repo == "" {
		return fmt.Errorf("GitHub environment variables not set")
	}

	deleteURL := fmt.Sprintf(
		"https://api.github.com/repos/%s/%s/contents/%s",
		username, repo, path,
	)

	body := map[string]string{
		"message": "Delete image via rvenvale API",
		"sha":     sha,
	}

	jsonBody, err := json.Marshal(body)
	if err != nil {
		return fmt.Errorf("failed to marshal delete body: %v", err)
	}

	req, err := http.NewRequest("DELETE", deleteURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.StatusCode >= 300 {
		responseText, _ := io.ReadAll(res.Body)
		return fmt.Errorf("GitHub deletion failed (%d): %s", res.StatusCode, responseText)
	}

	return nil
}

func ConvertToWebP(imageBytes []byte) ([]byte, error) {
	img, _, err := image.Decode(bytes.NewReader(imageBytes))
	if err != nil {
		return nil, fmt.Errorf("failed to decode image: %v", err)
	}

	var buf bytes.Buffer
	if err := webp.Encode(&buf, img, &webp.Options{
		Compression: webp.CompressionLossy,
		Quality:     80,
	}); err != nil {
		return nil, fmt.Errorf("failed to encode to webp: %v", err)
	}

	return buf.Bytes(), nil
}

func IsImageContentType(contentType string) bool {
	return strings.HasPrefix(contentType, "image/")
}