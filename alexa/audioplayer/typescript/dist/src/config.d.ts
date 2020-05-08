declare const config: {
    logging: boolean;
    intentMap: {
        'AMAZON.StopIntent': string;
        'AMAZON.PauseIntent': string;
        'AMAZON.ResumeIntent': string;
    };
    db: {
        FileDb: {
            pathToFile: string;
        };
    };
};
export = config;
