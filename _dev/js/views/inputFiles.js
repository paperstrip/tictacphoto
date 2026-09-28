window.inputFiles = new(function() {
    this.init = function(){
        $('[data-barba-namespace]').last().find('input[type="file"]').on('change',function(){
            if ($(this)[0].files[0]){
                $(this).parent().addClass('has-file');
                $(this).addClass('has-file');

                $(this).parent().find('span.files-name').html($(this)[0].files[0].name);
                
            }
            else{
                $(this).parent().removeClass('has-file');
                $(this).removeClass('has-file');

                $(this).parent().find('span.files-name').html('');
            }
        });
        $('[data-barba-namespace]').last().find('input[type="file"]').on('click',function(e){
            if ($(this).hasClass('has-file')){
                e.preventDefault();
                $(this).val('');
                $(this).removeClass('has-file');
                $(this).parent().removeClass('has-file');
                $(this).parent().find('span.files-name').html("");
            }
            
            
        });
        const dropContainer = [...document.getElementsByClassName('files-wrapper')];
        dropContainer.forEach(element => {
            let fileInput = element.querySelectorAll('input[type="file"]');
            
            element.ondragover = element.ondragenter = function(evt) {
                console.log(element);
                element.classList.add('drop');
                evt.preventDefault();
            };
            
            element.ondragleave = element.ondragleave = function(evt) {
                element.classList.remove('drop');
                evt.preventDefault();
            };
            element.ondrop = function(evt) {
                // pretty simple -- but not for IE :(
                element.classList.remove('drop');
                fileInput[0].files = evt.dataTransfer.files;
                // If you want to use some of the dropped files
                const dT = new DataTransfer();
                dT.items.add(evt.dataTransfer.files[0]);
                fileInput[0].files = dT.files;
                
                evt.preventDefault();
                $('input[type="file"]').trigger('change');
            };
        });
        
        
        window.appEvent.listen('formMessage:ajax:success',function(data,response,el){
            $('input[type="file"]').trigger('change');
            
        })
    }
})
