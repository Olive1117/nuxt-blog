<template>
  <div>{{ data }}</div>
</template>

<script setup lang="ts">
  const { data } = await useAsyncData('posts:all', async () => {
    let articles
    try {
      articles = await fetchAllParallel<ArticleDisplay>('articles', {
        pageSize: 2,
      })
      return articles.map((a) => {
        return formatArticle(a)
      })
    } catch (err) {
      console.log(err)
    }
  })
</script>
