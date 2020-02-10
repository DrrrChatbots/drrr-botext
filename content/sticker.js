$.ajax({
            type: "GET",
            url: 'https://store.line.me/stickershop/product/7431735/zh-Hant',
            //dataType: 'json',
            success: function(data){
                console.log(data);
            },
            error: function(jxhr){
                funcs.log("Fetch song failed, report developer:\n"
                    + JSON.stringify(jxhr));
            }
        })

