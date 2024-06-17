<template>
    <AccountForm :isRegister = "isRegisterParent" />
</template>

<script setup>
// @ is an alias to /src
import AccountForm from '@/components/AccountForm.vue'
import { ref } from 'vue'

const isRegisterParent = ref(true)
</script>

