$(function() {
    var word = ''

    $.ajax({
        url: "/search",
        contentType: "application/json",
        dataType: "json",
        success: (response) => {
            var results = []
                // console.log(response)
            if (response.length > 1) {
                response.forEach((ele) => {
                    results.push(ele.proj_name + " - " + ele.proj_location)
                })
            } else {
                results = response[0]
            }
            $("#search").autocomplete({
                    source: results,
                    value: ''

                })
                // console.log(results)
        },
        error: (error) => {
            console.log(error)
        }
    })

    // $("#search").on('keyup', (key) => {
    //     // console.log(key)
    //     word = word + key.key

    //     makeajax(word)
    //     console.log(word)
    // })
})

function makeajax(data) {
    $.ajax({
        method: "POST",
        data: JSON.stringify({ search: data }),
        url: "/search",
        contentType: "application/json",
        dataType: "json",
        success: (response) => {
            var results = []
                // console.log(response)
            if (response.length > 1) {
                response.forEach((ele) => {
                    results.push(ele.proj_name)
                })
            } else {
                results = response[0]
            }
            // $("#search").autocomplete({
            //     source: response.results
            // })
            console.log(results)
        },
        error: (error) => {
            console.log(error)
        }
    })
}