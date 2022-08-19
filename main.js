function Validator(options){


    function getParent(element,selector){
        while(element.parentElement)
        {
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    };
    var selectorRules= {};
    //Hàm validate
    function validate(inputElement,rule)
    {
        var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector); 
        var errorElement =  getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
        var errorMassage ;
        // Lấy ra các rule của selector 
        var rules = selectorRules[rule.selector];
        // Lặp qua từng rules & Kiểm tra
        // Nếu có lỗi thì dừng việc kiểm tra
        for(var i = 0 ; i< rules.length;i++)
        {
            switch(inputElement.type){
                case 'checkbox':
                case 'radio':
                    errorMassage =  rules[i](
                        formElement.querySelector(rule.selector +':checked')
                    )
                    break;
                default:
                    errorMassage =  rules[i](inputElement.value)
            }
        
            if(errorMassage)
            {
                break;
            }
        }
                    if(errorMassage)
                    {
                        errorElement.innerText = errorMassage;
                         getParent(inputElement,options.formGroupSelector).classList.add('invalid');
                    }
                    else{
                        errorElement.innerText='';
                         getParent(inputElement,options.formGroupSelector).classList.remove('invalid');
                    }
        return !errorMassage;
    }
    //Lấy element của form cần validate
    var formElement = document.querySelector(options.form);

    if(formElement){

        formElement.onsubmit = function(e)
        {
            e.preventDefault();
            var isFormValid = true;
            // Validate luôn
            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement,rule);
                if(!isValid){
                    isFormValid = false;
                }
            });
            if(isFormValid)
            {
               if(typeof options.onSubmit=== 'function')
               {
                var EnableInputs = formElement.querySelectorAll('[name]');
                var formValue = Array.from(EnableInputs).reduce(function(values,input){

                    switch(input.type){
                        case 'radio':
                            values[input.name]= formElement.querySelector('input[name="' + input.name +'"]:checked').value;
                            break;
                        case 'checkbox':
                            if(!input.matches(':checked')) {
                                values[input.name] ='' ;
                                return values;
                            }
                            if(!Array.isArray(values[input.name]) ){
                                values[input.name] =[] ;
                            }
                            values[input.name].push(input.value);
                            break;
                        case 'file':
                            values[input.name] = input.files;
                            break;
                        default:
                            values[input.name]= input.value
                    }
                    return values;
                },{});
                options.onSubmit(formValue);
               }
               else{
                //Submit voi mac dinh
                formElement.onSubmit();
               }
            }

        }
        // Xử lý lặp qua mỗi rule và xử lý
        options.rules.forEach(function(rule){

          // Lưu lại Rules
        if(Array.isArray( selectorRules[rule.selector]))
        {
            selectorRules[rule.selector].push(rule.test)
        }
        else{
            selectorRules[rule.selector] = [rule.test];
        }

          var inputElements = formElement.querySelectorAll(rule.selector);
          Array.from(inputElements).forEach(function(inputElement){
            // Khi người dùng ra khỏi input
            inputElement.onblur = function(){
                //value = inputElemt.value
                //test = rules.test
                validate(inputElement,rule);
                
            }
        // Khi nhập input
            inputElement.oninput = function()
            {
                var errorElement =  getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector); 
                errorElement.innerText='';
                 getParent(inputElement,options.formGroupSelector).classList.remove('invalid');
            }

        
          })
          
        })
    }
}


//Định nghĩa Rules
Validator.isRequired= function(selector){
    return {
        selector: selector,
        test : function(value)
        {
            return value? undefined : 'Vui lòng nhập trường này'
        }
    };
}
Validator.isEmail = function(selector){
    return {
        selector: selector,
        test : function(value)
        {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
            {
              return undefined;
            }
            else
              return 'Vui lòng nhập email';
        }
    };
}
Validator.minLength = function(selector,min,message){
    return {
        selector: selector,
        test : function(value)
        {
            return value.length >= min ? undefined :  message|| `Vui lòng nhập tối thiểu ${min} kí tự`
        }
    };
}
Validator.isConfirm = function(selector,getConfirmValue,message)
{
    return{
    selector:selector,
    test: function(value)
    {
        return value === getConfirmValue() ? undefined: message|| 'Giá trị nhập vào không chính xác'
    }
}
}
// Validator({
//     form: '#form-1',
//     formGroupSelector:'.form-group',
//     errorSelector: '.form-message',
//     rules:[
//         // Validator.isRequired('#fullname'),
//         // Validator.isRequired('#email'),
//          Validator.isRequired('#avatar'),
//         // Validator.isEmail('#email'),
//         // Validator.minLength('#password',6),
//         // // Validator.isRequired('input[name="gender"]'),
//         // Validator.isRequired('#password_confirmation'),
//         // Validator.isRequired('#province'),
//         // Validator.isConfirm('#password_confirmation',function(){
//         //     return document.querySelector('#form-1 #password').value;
//         // },'Mật khẩu nhập lại không chính xác'),
//     ],  
//     onSubmit: function(data)
//     {
//         console.log(data)
//     },
// })
// Validator({
//     form: '#form-2',
//     formGroupSelector:'.form-group',
//     errorSelector: '.form-message',
//     rules:[
//         // Validator.isRequired('#fullname'),
//         //  Validator.isRequired('#avatar'),
//         Validator.isEmail('#email'),
//         Validator.minLength('#password',6),
//         // // Validator.isRequired('input[name="gender"]'),
//         // Validator.isRequired('#password_confirmation'),
//         // Validator.isRequired('#province'),
//         // Validator.isConfirm('#password_confirmation',function(){
//         //     return document.querySelector('#form-1 #password').value;
//         // },'Mật khẩu nhập lại không chính xác'),
//     ],  
//     onSubmit: function(data)
//     {
//         console.log(data)
//     },
// })
function Validator(formSelector,options){

    // Gán giá trị mặc định cho tham số khi định nghĩa
    if(!options){
        options={};
    }
    function getParent(element,selector){
        while(element.parentElement)
        {
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    var formRules = {};
    /*Quy ước:
    -Có lỗi trả ra lỗi
    -Không có lỗi undefinded */
    var validatorRules={
        required:function (value){
            return value ? undefined : 'Vui lòng nhập trường này';
        },
        email: function (value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập Email';
        },
        min: function (min){
           return function (value){
                return value.length>= min?undefined:`Nhập ít nhất ${min} kí tự`
           }
        },
        max: function (max){
            return function (value){
                 return value.length <= max?undefined:`Nhập ít nhất ${max} kí tự`
            }
         }
    };
    var rulesName = 'required';
    // Lấy form Element trong DOM
    var formElement = document.querySelector(formSelector);

    // Xử lí khi có Element
    if(formElement)
    {
        var inputs = formElement.querySelectorAll('[name][rules]');
        for(var input of inputs){

            var rules =input.getAttribute('rules').split('|');
            for(var rule of rules)
            {
                var ruleInfo
                var isRuleHasValue =rule.includes(':');
                if(isRuleHasValue){
                    ruleInfo = rule.split(':')
                    // Lấy 'min' thôi
                    rule = ruleInfo[0];
                }
                var ruleFunc =validatorRules[rule];
                if(isRuleHasValue)
                {
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }

                if(Array.isArray(formRules[input.name]))
                {
                    formRules[input.name].push(ruleFunc);
                }
                else
                {
                    formRules[input.name]=[ruleFunc];
                }
            }
        
            // Lắng nghe sự kiện
            input.onblur= handleValidate;
            input.oninput = handleClear;
        }
    
        function handleValidate(event){
          var rules = formRules[event.target.name];
          var errorMassage;
          for(var rule of rules){
            errorMassage =  rule(event.target.value);
            if(errorMassage){
                break;
            }
          }
          // Hiện thị lỗi
          if(errorMassage)
          {
            console.log();
            var formGroup= getParent(event.target,'.form-group');
            if(formGroup)
            {
              formGroup.classList.add('invalid');
                var formMessage = formGroup.querySelector('.form-message');
                if(formMessage){
                    formMessage.innerText = errorMassage;
                }
            }
          }
          return !errorMassage;
        }
        // Hàm clear lỗi
        function handleClear(event){
         
            var formGroup= getParent(event.target,'.form-group');
            var formMessage = formGroup.querySelector('.form-message');
            if(formGroup.classList.contains('invalid')){
                formGroup.classList.remove('invalid');
                if(formMessage){
                    formMessage.innerText = '';
                }
            }
        }
         // Xử lí submit form
        formElement.onsubmit= function(event){
            event.preventDefault();

            var inputs = formElement.querySelectorAll('[name][rules]');
            var isValid =true;
            for(var input of inputs){
                   if( !handleValidate({target:input}))
                   {
                    isValid = false;
                   }
            }
            if(isValid)
            {
                if(typeof options.onSubmit ==='function'){
                    var EnableInputs = formElement.querySelectorAll('[name]');
                    var formValue = Array.from(EnableInputs).reduce(function(values,input){
    
                        switch(input.type){
                            case 'radio':
                                values[input.name]= formElement.querySelector('input[name="' + input.name +'"]:checked').value;
                                break;
                            case 'checkbox':
                                if(!input.matches(':checked')) {
                                    values[input.name] ='' ;
                                    return values;
                                }
                                if(!Array.isArray(values[input.name]) ){
                                    values[input.name] =[] ;
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name]= input.value
                        }
                        return values;
                    },{});
                    options.onSubmit(formValue);
                }
                else
                {
                    formElement.submit();
                }
            }
         }

    }
   
}