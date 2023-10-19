<template>
    <div class="container-fluid">
        <b-card          
            :header="cardHeader"
            header-text-variant="white"
            header-tag="header"
            header-bg-variant="dark"
            :title="cardTitle"
            style="max-width: 20rem;">
            <slot></slot>
        </b-card>
    </div>
</template>

<script>
    export default{
        props: ['cardHeader', 'cardTitle', 'cardText']
    }
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Old+Permic&display=swap');

    .form-control{
        margin-bottom: 1rem;
    }

    .card-header:first-child{
        font-family: 'Noto Sans Old Permic', sans-serif;
        font-weight: bold;
    }

    .card-body{
        color: #FFFFFF;
    }

    .container-fluid{
        display: flex;
        justify-content: center;
    }
</style>