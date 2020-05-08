declare const config: {
    logging: boolean;
    intentMap: {
        'AMAZON.StopIntent': string;
    };
    db: {
        FileDb: {
            pathToFile: string;
        };
    };
};
export = config;
