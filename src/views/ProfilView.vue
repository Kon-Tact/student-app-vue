<template>
    <AccountForm 
        :isProfilEdit = "isProfilEditParent" 
        :isAccountEdit = "isAccountEditParent" 
    />
</template>

<script setup lang="ts">
import AccountForm from '@/components/AccountForm.vue';
import { ref } from 'vue';

const isProfilEditParent = ref(true);
const isAccountEditParent = ref(false);
</script>