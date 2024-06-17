<template>
    <StudentForm :isEditStudent = "isStudentEditParent" />
</template>

<script setup>
// @ is an alias to /src
import StudentForm from '@/components/StudentForm.vue'
import { ref } from 'vue'

const isStudentEditParent = ref(true);
</script>