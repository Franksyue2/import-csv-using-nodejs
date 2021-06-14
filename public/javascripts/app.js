$(function(){

    $("#fetchdata").on('click', function(){
        $.get( "/fetchdata", function( data ) {
            var products = data['data'];
            $("#trdata").html('');
            $("#message").hide();
            var string = '';
            $.each(products, function(index, product ) {

                string += '<tr><td>'+(index+1)+'</td><td>'+product['_id']+'</td><td>'+product['name']+'</td><td>'+product['category']+'</td><td>'+product['price']+'</td><td>'+product['manufacturer']+'</td></tr>';
            });

            $("#trdata").html(string);
        });
    });
 
    $("#importdata").on('click', function(){
        $.get( "/import", function( data ) {
            $("#message").show().html(data['success']);
        });
    });

    $('#btn_upload').click(function(){

        var fd = new FormData();
        var files = $('#uploaddata')[0].files[0];
        console.log(files);
        fd.append('file',files);

        // AJAX request
        $.ajax({
          url: '/add',
          type: 'post',
          data: fd,
          contentType: false,
          processData: false,
          success: function(response){
            if(response != 0){
              // Show image preview
              $('#preview').append(response['success']);
            }else{
              alert('file not uploaded');
            }
          }
        });
      });

}); 