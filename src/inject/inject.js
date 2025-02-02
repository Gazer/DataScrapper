chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.action == 'parseData') {
			var formula = request.formula;
			var result = [];
			if(formula.row) {
				// Row mode
				result.push([]);
				formula.cols.forEach(function(el){
					result[0].push(el.title);
				});
				$(formula.row).each(function(){
					var row = $(this);
					var row_result = [];
					formula.cols.forEach(function(el){
						row_result.push($.trim(row.find(el.selector).text()) || formula.default_value);
					});
					result.push(row_result);
				});
			} else {
				// Col mode
				var subresult = [];
				formula.cols.forEach(function(el){
					var col = [];
					col.push(el.title);
					$(el.selector).each(function(){
						col.push($.trim($(this).text()));
					});
					subresult.push(col);
				});

				if(subresult.length) {
					for (var i in subresult[0]) {
						var row = [];
						subresult.forEach(function(el){
							row.push(el[i] || formula.default_value);
						});
						result.push(row);
					}
				}
			}
			sendResponse(result);
    } else if (request.action == 'clickNext') {
      console.log('Click next');
      var next_page = request.next_page;
      console.log(next_page);
      var link = $(next_page);
      if (link[0]) {
        if (window.location != link[0].href) {
          link[0].click();
          sendResponse(true);
        } else {
          sendResponse(false);
        }
      } else {
        sendResponse(false);
      }
    }
	}
);
