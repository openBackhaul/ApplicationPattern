const { Kafka } = require('kafkajs');

let consumer = undefined;

/**
 * This function connects to kafka broker <br>
 * @param {String} clientId Identifier of client to be sent to kafka broker <br>
 * @param {List} brokers List of brokers for kafka to be connected <br>
 */
exports.connect = async function (groupId, clientId, brokers) {
    try {
        const kafka = new Kafka({
            clientId: clientId,
            brokers: brokers
        });
        consumer = kafka.consumer({ groupId: groupId });
        consumer.on(consumer.events.CONNECT, ()=>{
            console.log("Consumer successfully connected to kafka broker");
            return true;
        });
        consumer.on(consumer.events.DISCONNECT, ()=>{
            console.log("Consumer connection to kafka failed !!");
            throw new Error(532, "Could not connect to Kafka broker!!");
        });
        consumer.on(consumer.events.REQUEST_TIMEOUT, ()=>{
            console.log("Consumer connection to kafka request timeout !!");
            throw new Error(532, "Could not connect to Kafka broker!!");
        });
        consumer.on(consumer.events.STOP, ()=>{
            console.log("Consumer connection to kafka stopped !!");
            throw new Error(532, "Could not connect to Kafka broker!!");
        });
        await consumer.connect();
    } catch (error) {
        console.log(error);
        console.log("Consumer connection to kafka failed !!");
        return false;
    }
}

/**
 * This function subscribes to Kafka broker. Later receives and routes the messages to provided messageHandler. <br>
 * @param {List} topics list of all topics that shall be subscribed and listened to <br>
 * @param {Function} routingFunction the message shall be redirected to given function <br>
 */
exports.subscribeMessages = async function ( topics, routingFunction ) {
    try {
        if (consumer) {
            for (const topic of topics) {
                await consumer.subscribe({
                    topic: topic
                });
                console.log(`consumer now connected to topic: ${topic} and listening to latest-messages`);
            }
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    let receivedMessage = message.value.toString();
                    console.log(`message ${receivedMessage} successfully received from topic: ${topic} and partition: ${partition}`);
                    try {
                        routingFunction(JSON.parse(receivedMessage), topic);
                    } catch (error) {
                        routingFunction(receivedMessage, topic);
                    }
                }
            })
        } else {
            console.log(`Kafka consumer not available !!!`);
        } 
    } catch (error) {
        console.log(error);
    }
    return;
}


/**
 * This function disconnects the communication with kafka <br>
 */
exports.disconnectKafka = async function () {
    try {
        await consumer.disconnect();
        console.log("consumer connection to kafka disconnected successfully!!");
    } catch (error) {
        console.log(error);
    }
}