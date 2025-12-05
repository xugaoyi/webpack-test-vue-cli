<template>
    <div>
        <h1>Hello World</h1>
        <el-button type="primary">Primary</el-button>
        <ul>
            <li><router-link to="/">Home111</router-link></li>
            <li><router-link to="/about">About222</router-link></li>
        </ul>
        <router-view />
    </div>
</template>

<script setup>
import { ElButton } from 'element-plus'
</script>

<style scoped>
h1 {
    color: red;
}
</style>