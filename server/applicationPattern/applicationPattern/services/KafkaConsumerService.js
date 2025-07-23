const { Kafka, logLevel } = require('kafkajs');

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
        await consumer.connect();

        console.log("Consumer successfully connected to kafka client");
        return true;
    } catch (error) {
        console.log(error);
        console.log("Consumer connection to kafka failed !!");
        return false;
    }
}

/**
 * This function receives and routes message to provided messageHandler. Argument contains an object that contains following: <br>
 * @param {List} topics list of all topics that shall be subscribed and listened to <br>
 * @param {Function} routeMessage the message shall be redirected to given function <br>
 */
exports.subscribeMessages = async function ({ topics, routeMessage }) {
    try {
        if (consumer) {
            for (const topic of topics) {
                await consumer.subscribe({
                    topic: topic,
                    fromBeginning: true
                });
                console.log(`consumer now connected to topic: ${topic} and listening to latest-messages`);
            }
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    let receivedMessage = message.value.toString();
                    console.log(`message ${receivedMessage} successfully received from topic: ${topic} and partition: ${partition}`);
                    try {
                        routeMessage(JSON.parse(receivedMessage), topic);
                    } catch (error) {
                        routeMessage(receivedMessage, topic);
                    }
                }
            })

        } else {
            console.log(`message could not be sent to kafka: producer connection error`);
        }
        return;
    } catch (error) {
        console.log(error);
    }
}
