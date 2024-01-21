import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
    data (){
        return {
            user:{
                username: '', 
                password: '',
            },
            url : 'https://vue3-course-api.hexschool.io/v2',
        }
    },
    methods: {
        login() {
            axios.post(`${this.url}/admin/signin`,this.user)
                .then((res)=>{
                    const { token,expired  } = res.data;
                    document.cookie = `kawaToken=${token}; expires = ${new Date(expired)}; path=/`;
                    alert('登入成功');
                    window.location = 'interior.html';
                })
                .catch((err)=>{
                    console.log(err.res.data.message);
                }) 
        }
    },
}).mount('#app');