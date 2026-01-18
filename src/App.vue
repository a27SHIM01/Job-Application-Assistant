<script setup>
import { ref, onMounted } from 'vue';

const responseText = ref('');
const prompt = ref('');


function main() {
  
}

async function ask() {
  const res = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: prompt.value }),
  });
  const data = await res.json();
  responseText.value = data.reply || 'ERROR: no data';
}

async function uploadImage() {
  console.log('uploadImage() triggered')
  try {
    const items = await navigator.clipboard.items();
    
    for (const item of items) {
      console.log('loop triggered')
      if (item.type.startsWith("image/")) {
        console.log('if triggered')
        const file = item.getAsFile()
        this.previewUrl = URL.createObjectURL(file)

        // Upload to backend
        const formData = new FormData()
        formData.append("image", file)

        await fetch("/api/upload", {
          method: "POST",
          body: formData
        })
      }
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
}

// onMounted(main);
</script>

<template>
  <h1>{{ prompt }}</h1>
  <div>
    <textarea v-model="prompt" rows="20" cols="50"></textarea>
    <div contenteditable="true" @paste=""></div>
    <br>
    <input @click="ask(); uploadImage()" type="submit">
  </div>
  <hr>
  <div>
    <p>{{ responseText }}</p>
  </div>
  

</template>

<style scoped></style>
