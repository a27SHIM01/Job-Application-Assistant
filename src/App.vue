<script setup>
  import { GoogleGenAI } from '@google/genai';
import { onMounted } from 'vue';

  const ai = new GoogleGenAI({})

  async function main() {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Explain how AI works in a few words",
    });
    console.log(response.text);
  }

  onMounted(main)

</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>

</template>

<style scoped></style>
