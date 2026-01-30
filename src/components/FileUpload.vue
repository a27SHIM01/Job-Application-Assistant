<script setup>
import { ref, computed } from 'vue';

const file = ref(null);
const uploading = ref(false);
const error_msg = ref('');

const isDisabled = computed(() => !file.value || uploading.value);

function onFileChange(event) {
  error_msg.value = '';
  const target = event.target;
  if (target && target.files && target.files.length > 0) {
    file.value = target.files[0];
  } else {
    file.value = null;
  }
}

async function uploadFile() {
  if (!file.value) return;

  uploading.value = true;
  error_msg.value = '';

  const formData = new FormData();
  formData.append("file", file.value);
  console.log('formData', formData);

  try {
    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Gemini file URI:", data.fileUri);
  } catch (err) {
    console.error("Upload failed", err.message);
    error_msg.value = err.message;
  } finally {
    uploading.value = false;
  }
}
</script>

<template>

<div>
  <label for="resume">Upload your resume: </label>
  <input id="resume" type="file" name="resume" @change="onFileChange">
  <button type="button" @click="uploadFile" :disabled="isDisabled">Upload</button>
  <p>{{ (error_msg !== '') ? error_msg : (uploading ? 'Uploading...' : 'Ready to upload') }}</p>
</div>

</template>

<style scoped>
div {
  margin: 5px;
  padding: 5px;
  border-style: ridge;
}
</style>