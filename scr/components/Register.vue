<template>
  <div class="wrap-login100">
				<form class="login100-form validate-form">
					<span class="login100-form-logo">
						<i class="zmdi zmdi-landscape"></i>
					</span>

					<span class="login100-form-title p-b-34 p-t-27">
						Sign in
					</span>

					<div class="wrap-input100 validate-input" data-validate = "Enter username">
						<input class="input100" type="text" name="username" placeholder="Username" v-model="form.username" required>
						
					</div>
                    <div class="wrap-input100 validate-input" data-validate = "Enter email">
						<input class="input100" type="email" name="email" placeholder="email" v-model="form.email" required>
						
					</div>

					<div class="wrap-input100 validate-input" data-validate="Enter password">
						<input class="input100" type="password" name="pass" placeholder="Password" v-model="form.password" required>
						
					</div>
                    <div class="wrap-input100 validate-input" data-validate="Re-enter password">
						<input class="input100" type="password" name="pass" placeholder="Password" v-model="form.retypePassword" required>
						
					</div>

					<div class="contact100-form-checkbox">
						<input class="input-checkbox100" id="ckb1" type="checkbox" name="remember-me">
						<label class="label-checkbox100" for="ckb1">
							Remember me
						</label>
					</div>

					<div class="container-login100-form-btn">
						<button class="login100-form-btn" @click.prevent="createUser">
							Login
						</button>
					</div>
                    <div class="text-center p-t-20" >
						<button  @click.prevent ="cancel">
							cancel
						</button>
					</div>

					<div class="text-center p-t-20" >
						<button class="txt1" href="#">
							Forgot Password?
						</button>
					</div>
				</form>
	</div>
</template>

<script>
import axios from '../axios'
import { log } from 'util'
export default {
name:"RegisterForm",
data(){
return{
    form:{
        username:'',
        email:'',
        password:'',
        retypePassword:''
    }
}
},
methods:{	
    cancel(){
		
        this.$emit('cancelSignIn')
    },
    createUser(){
       if(this.form.password == this.form.retypePassword){
		   axios({
            method:"POST",
            url:"/user/register",
            data:{
                username:this.form.username,
                email:this.form.email,
                password:this.form.password
            }
        })
        .then(result=>{
			localStorage.setItem('token',result.data.token) 
			localStorage.setItem('username',result.data.username) 			       
            this.$emit('succeslogin')
        })
        .catch(err=>{
            Vue.toasted.global.my_app_error({
                    message : 'Oppps Something Wrong',
                });
        })
	   }else{
		   Vue.toasted.global.my_app_error({
                    message : 'Password not Match',
        	});
	   }
        
    }
}
}
</script>

<style>

</style>