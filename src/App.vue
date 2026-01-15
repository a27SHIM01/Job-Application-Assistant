<script setup>
import { ref, onMounted } from 'vue';

const responseText = ref('');

async function main() {
  const res = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Explain how AI works in a few words' }),
  });
  const data = await res.json();
  responseText.value = data.text || JSON.stringify(data);
}

onMounted(main);
</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>

</template>

<style scoped></style>
