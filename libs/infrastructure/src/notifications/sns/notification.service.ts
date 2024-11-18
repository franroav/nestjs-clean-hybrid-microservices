const AWS = require('aws-sdk');
//Inicializar variables
const config = ENV[node_env];

class SnsService {
    
    constructor () {
        this.sns = new AWS.SNS({region: 'us-east-1'});
        this.topic = config.snsTopicARN;
    }
    
    async event (data, subject = null, attr = null) {
        return new Promise((resolve, reject) => {
            let params = {
                Subject: subject || "MSG",
                TopicArn: this.topic,
                Message: JSON.stringify(data),
                MessageAttributes: attr || data['params']
            }

            let idTrace = data.idTrace;
            let app = data.app;
          
            this.sns.publish(params, function (err, data) {
                if (err) {
                    console.log(JSON.stringify({
                        timestamp: new Date(),
                        idTrace: idTrace,
                        app: app,
                        service: events.service.name,
                        type: events.log.name,
                        object: events.log.types.sns,
                        action: subject,
                        log: err.stack,
                        message: "Ha ocurrido un error en el SNS"}));
                    resolve(false);
                } else {
                    console.log(JSON.stringify({
                        timestamp: new Date(),
                        idTrace: idTrace,
                        app: app,
                        service: events.service.name,
                        type: events.log.name,
                        object: events.log.types.sns,
                        action: subject,
                        log: data.MessageId,
                        message: "Se ha ejecutado correctamente el SNS"}));
                    resolve(true);
                }
            });
        });
    }
}

module.exports = SnsService