function reduceLayers(layers, length) {

    var initialArray = [];
    while(initialArray.length<length) {
        initialArray.push("#000000");
    }

    return layers.reduce((prev, curr, index) => {
        curr.forEach((item, key) => {
            if(item) prev[key] = item;   
        });

        return prev;


    }, initialArray);

};

module.exports = reduceLayers;
