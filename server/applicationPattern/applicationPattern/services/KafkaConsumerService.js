const { Kafka } = require('kafkajs');

let consumer = undefined;
let topicList = [];

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
        consumer.on(consumer.events.CONNECT, () => {
            console.log("Consumer successfully connected to kafka broker");
            return true;
        });
        consumer.on(consumer.events.DISCONNECT, () => {
            console.log("Consumer connection to kafka failed !!");
            throw new Error(532, "Could not connect to Kafka broker!!");
        });
        consumer.on(consumer.events.REQUEST_TIMEOUT, () => {
            console.log("Consumer connection to kafka request timeout !!");
            throw new Error(532, "Could not connect to Kafka broker!!");
        });
        consumer.on(consumer.events.STOP, () => {
            console.log("Consumer connection to kafka stopped !!");
            throw new Error(532, "Could not connect to Kafka broker!!");
        });
        await consumer.connect();
        return consumer;
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
exports.subscribeMessages = async function (topics, routingFunction) {
    topicList = topics;
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
exports.disconnectKafka = async function (consumerObject) {
    try {
        if(consumerObject){
        await consumerObject.disconnect();
        }else{
        await consumer.disconnect();
        }
        console.log("consumer connection to kafka disconnected successfully!!");
    } catch (error) {
        console.log(error);
    }
}

/**
 * This function pause the communication with kafka topics<br>
 */
exports.pauseKafkaConnection = async function () {
    try {
        let status = await checkStatus();
        if (status == "paused") {
            console.log("************************subscription to kafka topics are already paused !!**********************************");
        } else {
            await consumer.pause(topicList.map(topic => ({ topic })));
            await sleep();
            status = await checkStatus();
            if (status == "paused") {
                console.log("************************connection to kafka paused successfully!!**********************************");
            } else {
                console.log("************************connection to kafka could not be paused !!**********************************");
            }
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * This function resume the communication with kafka topics if paused<br>
 */
exports.resumeKafkaConnection = async function () {
    try {
        let status = await checkStatus();
        if (status == "running") {
            console.log("************************subscription to kafka ia already running!!**********************************");
        } else {
            await consumer.resume(topicList.map(topic => ({ topic })));
            await sleep();
            status = await checkStatus();
            if (status == "running") {
                console.log("************************connection to kafka resumed successfully!!**********************************");
            } else {
                console.log("************************connection to kafka could not be resumed !!**********************************");
            }
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * This function checks the status if transactions to kafka topics are paused or running<br>
 */
async function checkStatus() {
    try {
        let pausedTopics = await consumer.paused().map(p => p.topic);
        if (Object.keys(pausedTopics).length == 0) return "running";
        if (pausedTopics.every(topic => topicList.includes(topic))) return "paused";
        else return "partial_running";
    } catch (error) {
        throw error;
    }
}

async function sleep() {
    await setTimeout(() => { console.log("waiting to pause/resume") }, 1000);
}