



    const form = document.querySelector('#form')
    
    
    const small = document.querySelector('#small')
    const small2 = document.querySelector('#small2')
    const small3 = document.querySelector('#small2')


   

    try {
    const username = form.username
    const password = form.password

    //Small validation for login form
    const userValidate = () => {
        if (username.value.length == 0) {
            small.innerHTML = 'Username cannot be blank.'

        }

        else if (username.value.length <= 5) {
            small.innerHTML = 'Username has  a minimum of 6 characters.'

        }
        else {
            small.innerHTML = "";

        }

    }
    const passValidate = () => {
        if (password.value.length == 0) {
            small2.innerHTML = 'Password cannot be blank.'

        }
        else if (password.value.length <= 5) {
            small2.innerHTML = 'Password has a minimum of 6 characters.'

        }
        else {

            small2.innerHTML = "";

        }
    }



     
        small.style.color = "red"
        small2.style.color = "red"
    username.addEventListener('input', userValidate)
    password.addEventListener('input', passValidate);

    form.addEventListener('submit', (e) => {
        if (
            username.value.length == 0 ||
            username.value.length < 6 ||
            !username.value.match('^[A-Za-z0-9]+$') ||
            password.value.length == 0 ||
            password.value.length < 6 ||
            !password.value.match('^[A-Za-z0-9]+$')
        ) {
            e.preventDefault();
            window.location.reload();
        }

    })
    form.addEventListener('input', (e) => {
        if (
            username.value.length == 0 ||
            username.value.length < 6 ||
            !username.value.match('^[A-Za-z0-9]+$') ||
            password.value.length == 0 ||
            password.value.length < 6 ||
            !password.value.match('^[A-Za-z0-9]+$')
        ) {
          small3.style.color = "red";
          small3.innerHTML = 'Please check the fields'
        }
        else{
            small3.innerHTML = ''
        }

    })
}
catch(error){
   
}
const regForm = document.querySelector('#regForm')

try{
    const username2 = regForm.username2
    const password1 = regForm.password1
    const password2 = regForm.password2
    const email = regForm.email
    const usernameWarning = document.querySelector('#username2Warning')
    const warning2 = document.querySelector('#warning2')
    username2.value =  username2.value.trim();
    password1.value = password1.value.trim();
   password2.value =  password2.value.trim();
   regForm.name.value =  regForm.name.value.trim();
    username2.addEventListener('input', () => {
        if (username2.value.length == 0) {
            usernameWarning.innerHTML = 'Username is required'
            usernameWarning.style.color = 'red'
            username2.style.borderColor = 'red'
            
        }
        else if (!username2.value.match('^[A-Za-z0-9]+$')) {
            usernameWarning.innerHTML = 'Username must not contain special characters'
            usernameWarning.style.color = 'red'
            username2.style.borderColor = 'red'
            
        }
        else if (username2.value.length < 6) {
            usernameWarning.innerHTML = 'Minimum of 6 characters'
            usernameWarning.style.color = 'red'
            username2.style.borderColor = 'red'
            
        }
        else {
            username2.style.borderColor = 'gray'
            usernameWarning.innerHTML = ''
           
        }
    })

    password1.addEventListener('input', () => {
        if (password1.value.length == 0) {
            password1Warning.innerHTML = 'Password is required'
            password1Warning.style.color = 'red'
            password1.style.borderColor = 'red'
            
        }
        else if (!password1.value.match('^[A-Za-z0-9]+$')) {
            password1Warning.innerHTML = 'Password must not contain special characters'
            password1Warning.style.color = 'red'
            password1.style.borderColor = 'red'
            
        }

        else if (password1.value.length < 6) {
            password1Warning.innerHTML = 'Minimum of 6 characters'
            password1Warning.style.color = 'red'
            password1.style.borderColor = 'red'
            
        }
        else {
            password1.style.borderColor = 'gray'
            password1Warning.innerHTML = ''
        
        }
    })
    password2.addEventListener('input', () => {
        if (password2.value != password1.value) {
            password2Warning.innerHTML = 'Passwords do not match'
            password2Warning.style.color = 'red'
            password2.style.borderColor = 'red'
        
        }
        else {
            password2.style.borderColor = 'gray'
            password2Warning.innerHTML = ''
            
        }
    })

    regForm.addEventListener('submit', (e)=>{
        if(username2.value.length == 0  || !username2.value.match('^[A-Za-z0-9]+$') ||
            username2.value.length < 6 ||
            password1.value.length == 0 ||
            !password1.value.match('^[A-Za-z0-9]+$') ||
            password1.value.length < 6 ||
            regForm.email.value == 0 ||
            regForm.name.value == 0){
            warning2.style.color= "red"
            e.preventDefault()
            alert('Please check the fields')
            window.location.reload();
           
              
            
        }
        
    })
    regForm.addEventListener('input', ()=>{
        if(username2.value.length == 0  || !username2.value.match('^[A-Za-z0-9]+$') ||
            username2.value.length < 6 ||
            password1.value.length == 0 ||
            !password1.value.match('^[A-Za-z0-9]+$') ||
            password1.value.length < 6 ||
            regForm.email.value == 0 ||
            regForm.name.value == 0){
            warning2.style.color= "red"
            warning2.innerHTML='Please check the fields'   
            
        }
        else{
            warning2.innerHTML=""
        }
        
    })




    }
catch (e) {
  
}


