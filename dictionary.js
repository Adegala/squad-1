$(document).ready(function () {

    $.getJSON('http://annotatingtext.appspot.com/dictionary-get-api', printTerms);
    $('form').submit(function (e) {
        e.preventDefault();
        $.post('http://annotatingtext.appspot.com/api/adaptor/dictionary-api', {term: $('#term').val().toLowerCase().replace(/\s/g, ''), defined: $('#defined').val()}, printTerms);
        this.reset();
		$('#alertMsg').html('<div class="alert alert-success" role="alert">'+"Vocabulary successfully inserted"+'</div>').fadeTo(5000,5000).slideUp(500, function(){});
		
    });

});

function printTerms(terms) {
    $('body>dl').empty();
	var termStrings =[];
    $.each(terms, function () {
        $('<dt>').text(this.term).appendTo('body>dl');
		if(this.term!==undefined){
		termStrings.push(this.term);
		}
		//alert(this.term);
        $('<dd>').text(this.defined).appendTo('body>dl');
		
    });
	
    /* $( "#searchID" ).autocomplete({
      source: termStrings
    }); */
    $("#searchID").autocomplete({

        source:function( request, response ) {
          $.ajax({
			type:"POST",
              url: "/search",
              dataType: "json",
              data: {
                 //featureClass: "P",
                 //style: "full",
                // maxRows: 12,
                 term: request.term.toLowerCase().replace(/\s/g, '')
              },
			 
              success: function( data ) {
			  //alert(data);
			  //response(termStrings);
                   /* response( $.map( data, function( item ) { 
                        return { 
                           term: item, 
                          // value: item 
                        } 
                   }));  */
				  $("#defID").text(data);
             },
			 error: function(xhr, status, err){
                                console.log(status);
                                console.log(err);
                            }
          });
       }

    });

 
    $('dt').off('dblclick').dblclick(function() {
        $.ajax({
            url: 'http://annotatingtext.appspot.com/api/adaptor/dictionary-api/' + $(this).text(),
            type: 'DELETE',
            success: printTerms
        });
    });
}


