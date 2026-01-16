<script setup>
import { ref, onMounted } from 'vue';

const responseText = ref('');
const prompt = ref('List the dates for the solstices and equinoxes.');


async function main() {
  const res = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: prompt.value }),
  });
  const data = await res.json();
  responseText.value = data.text || JSON.stringify(data) || 'ERROR: no data';
}

onMounted(main);
</script>

<template>
  <h1>{{ prompt }}</h1>
  <p>{{ responseText }}</p>

</template>

<style scoped></style>
