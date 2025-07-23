const { Kafka } = require('kafkajs');

let producer = undefined;

/**
 * This function connects to kafka broker <br>
 * @param {String} clientId Identifier of client to be sent to kafka broker <br>
 * @param {List} brokers List of brokers for kafka to be connected <br>
 */
exports.connect = async function (clientId, brokers) {
    try {
        const kafka = new Kafka({
            clientId: clientId,
            brokers: brokers
        });
        producer = kafka.producer();
        await producer.connect();
        console.log("Producer successfully connected to kafka client");
        return true;
    } catch (error) {
        console.log(error);
        console.log("Producer connection to kafka failed !!");
        return false;
    }
}

/**
 * This function sends message to provided topic <br>
 * @param {String} topic target topic in kafka broker where the messages shall be sent <br>
 * @param {String} message the message that shall be sent to topic <br>
 */
exports.sendMessage = async function (topic, message) {
    try {
        if (producer) {
            await producer.send({
                topic: topic,
                messages: [
                    {value: safeStringify(message)}
                ]
            })
            console.log(`message ${message} successfully sent to ${topic}`);
        } else {
            console.log(`message could not be sent to kafka: producer connection error`);
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
        await producer.disconnect();
        console.log("producer connection to kafka disconnected successfully!!");
    } catch (error) {
        console.log(error);
    }
}

function safeStringify(message) {
    if( message != null && typeof message== 'object') {
        return JSON.stringify(message);
    }
    return message;
}
