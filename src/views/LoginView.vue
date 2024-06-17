<template>
    <AccountForm :isLogin = "isLoginParent" />
</template>

<script setup lang="ts">
import AccountForm from '@/components/AccountForm.vue';
import { ref } from 'vue';

const isLoginParent = ref(true);
</script>

