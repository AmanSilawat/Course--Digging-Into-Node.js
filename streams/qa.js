// question answer
// ! multiple streaming at a time

stream1
stream2

function streamComplete(stream) {
    return new Promise(function c(res) {
        stream.on('end', res);
    })
}


let allDone = Promise.all([
    streamComplete(stream1),
    streamComplete(stream2)
])
.then(function handleResponse(responses) {
    responses[0]; // stream1's content
    responses[1]; // stream2's content
})