var axios = require("axios")

module.exports = (app, SearchHistory) => {
    app.get('/', (req, res) => {
        res.sendFile(process.cwd() + '/public/index.html')
    })
    
    app.get('/latest', (req, res) => {
        SearchHistory.find({}, null, {
            limit: 10,
            sort: {
                "when": -1
            }
        }, (err, history) => {
            if(err) throw err
            
            res.send(history.map((arg) => {
                return {
                    term: arg.term,
                    when: arg.when
                }
            }))
        })
    })
    
    app.get('/:query', (req, res) => {
        var query = req.params.query;
        var size = req.query.offset || "10";
        
        var searchHistory = {
            "term": query,
            "when": new Date().toLocaleString()
        };
        
        if(query !== 'favicon.ico') {
            save(searchHistory);
        }
        
        axios({
            url: "https://api.cognitive.microsoft.com/bing/v5.0/images/search",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": process.env.MCS_API_KEY
            },
            params: {
                q: query,
                count: "10",
                offset: size.toString()
            }
        }).then((response) => {
            res.send(response.data.value.map((img) => {
                return {
                    "url": img.contentUrl,
                    "snippet": img.name,
                    "thumbnail": img.thumbnailUrl,
                    "context": img.hostPageUrl,
                }
            }))
        }).catch((err) => {
            console.log("Error: " + err)
        })
        
    })
    
    function save(searchHistory) {
        var history = new SearchHistory(searchHistory)
        
        history.save((err, history) => {
            if(err) throw err
            
            console.log("Saved search history: " + history)
        })
    }
}