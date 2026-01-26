<script setup>
import { ref } from 'vue';

const file = ref(null);
const uploading = ref(false);

function onFileChange(event) {
  file.value = event.target.files[0];
}

async function uploadFile() {
  if (!file.value) return;

  uploading.value = true;

  const formData = new FormData();
  formData.append("file", file.value);

  try {
    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Gemini file URI:", data.fileUri);
  } catch (err) {
    console.error("Upload failed", err);
  } finally {
    uploading.value = false;
  }
}


</script>

<template>

<div>
  <label for="resume">Upload your resume: </label>
  <input type="file" name="resume" @change="onFileChange">
  <input type="submit" @click="uploadFile" :disabled="!file || uploading" value="Upload">
</div>

</template>

<style scoped>
div {
  margin: 5px;
  padding: 5px;
  border-style: ridge;
}
</style>