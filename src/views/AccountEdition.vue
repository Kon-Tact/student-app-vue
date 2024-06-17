<template>
    <AccountForm :isEditAccount = "isAccountEditParent" />
</template>

<script setup lang="ts">
import AccountForm from '@/components/AccountForm.vue';
import { ref } from 'vue';

const isAccountEditParent = ref(true);
</script>