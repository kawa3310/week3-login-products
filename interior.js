import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

//先宣告Modal變數給null的值，方便在mounted內實體化新增、編輯以及刪除Modal
let productModal = null;
let delProductModal = null;

createApp({
    data (){
        return{
            url: 'https://vue3-course-api.hexschool.io/v2',
            path: 'reirei',
            products: [],
            isNew: false,
            tempPorducts: {
                imagesUrl: [],
            },
        }
    },
    methods: {
         //確認登入
        cheakLongin() {
            axios.post(`${this.url}/api/user/check`)
            .then((res)=>{
                this.getData();
            })
            .catch((err)=>{
                alert(err.response.data.message);
                window.location = 'login.html';
            })
        },
         //取得資料
        getData() {
            axios.get(`${this.url}/api/${this.path}/admin/products`)
                .then((res)=>{
                    this.products = res.data.products;
                })
                .catch((err)=>{
                    alert(err.response.data.message);
                })
        },
        //開啟modal
        openModel(states,item) {
            //新增狀態
            if(states === 'new'){
                //把tempProduct的值清空
                this.tempProducts = {
                    imagesUrl: [],
                }
                //將isNew狀態改為true方便做新增function的判斷
                this.isNew = true;
                productModal.show();
            }
            //編輯狀態
            else if(states === 'edit'){
                this.isNew = false;
                //使用展開，將product裡的物件淺拷貝到tempPorducts裡
                this.tempPorducts = {...item};
                productModal.show();
            }
            //刪除狀態
            else if(states === 'delet'){
                delProductModal.show();
            }
        },
        //刪除資料
        delProduct() {  
            axios.delete(`${this.url}/api/${this.path}/admin/product/${this.tempPorducts.id}`)
            .then((res) => {
                alert(res.data.message);
                delProductModal.hide();
                this.getData()
            }).catch((err) => {
                alert(err.response.data.message);
            })
        },
        //新增資料
        addProduct() {
            //預設為新增商品狀態
            let url = `${this.url}/api/${this.path}/admin/product`;
            let http = 'post';
            
            // 判斷點擊的商品是否已建立，是則進入編輯商品區塊
            if (!this.isNew) {
                url = `${this.url}/api/${this.path}/admin/product/${this.tempPorducts.id}`;
                http = 'put'
            }
            
            axios[http](url, { data: this.tempPorducts })
                .then((res) =>{
                    alert(res.data.message);
                    //成功新增後關閉Modal
                    productModal.hide();
                    this.getData();
                })
                .catch((err) =>{
                    alert(err.response.data.message);
                })
        },
        //新增圖片
        addImg() {
            //以防this.tempProducts出錯，先賦予tempProductsc裡一個imagesUrl的陣列
            this.tempProducts.imagesUrl = [];
            this.tempPorducts.imagesUrl.push('');
        },
    },
    //初始化 and Modal設定
    mounted (){
        productModal = new bootstrap.Modal(document.querySelector('#productModal'),{
            //禁止使用Esc關閉Modal
            keyboard: false,
            //禁止點擊Modal外的區域關閉Modal
            backdorop: 'static'
        });
        delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'),{
            keyboard: false,
            backdorop: 'static'
        });

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)kawaToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common['Authorization'] = token;

        this.cheakLongin();
    }
}).mount('#app');