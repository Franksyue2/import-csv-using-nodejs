$(function(){
    $("#fetchStudentData").on('click', function(){
        $.get( "/fetchStudentdata", function( data ) {
            var students = data['data'];
            $("#trdata").html('');
            $("#message").hide();
            var string = '';
            $.each(students, function(index, student ) {

                string += '<tr><td>'+(index+1)+'</td><td>'+student['student_id']+'</td><td>'+student['status']+'</td><td>'+student['application_date']+'</td><td>'+student['department']+'</td><td>'+student['course']+'</td><td>'+student['api_called']+'</td></tr>';
            });
            $("#trdata").html('');
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
        // console.log(files);
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

    $(".modal").on("hidden.bs.modal", function(){
        $("#preview").html("");
    });

}); 