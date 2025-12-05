<template>
    <div>
        <h1>Hello World</h1>
        <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/about">About</router-link></li>
        </ul>
        <router-view />
    </div>
</template>

<script setup>
</script>

<style scoped>
h1 {
    color: red;
}
</style>