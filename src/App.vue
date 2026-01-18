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

// onMounted(main);
</script>

<template>
  <h1>{{ prompt }}</h1>
  <div>
    <textarea v-model="prompt" rows="20" cols="50"></textarea>
    <input @click="ask" type="submit">
  </div>
  <div>
    <p>{{ responseText }}</p>
  </div>
  

</template>

<style scoped></style>
