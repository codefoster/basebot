import * as path from 'path';
import { config } from 'dotenv';
import { LuisRecognizer } from 'botbuilder-ai';
import { ConversationState, MemoryStorage, UserState } from 'botbuilder';

export class BotServices {
  private _luisRecognizer: LuisRecognizer;

  
// Define a state store for your bot. See https://aka.ms/about-bot-state to learn more about using MemoryStorage.
// A bot requires a state store to persist the dialog and user state between messages.
  private _conversationState : ConversationState;
  private _userState : UserState;

  constructor() {
    this.loadLocalEnvironmentVariables();
    this.configureState();
  }

  configureState() {
    // For local development, in-memory storage is used.
    // CAUTION: The Memory Storage used here is for local bot debugging only. When the bot
    // is restarted, anything stored in memory will be gone.

    const memoryStorage = new MemoryStorage();
    this._conversationState = new ConversationState(memoryStorage);
    this._userState = new UserState(memoryStorage);

    // CAUTION: You must ensure your product environment has the NODE_ENV set
    //          to use the Azure Blob storage or Azure Cosmos DB providers.
    // Add botbuilder-azure when using any Azure services.
    // import { BlobStorage } from 'botbuilder-azure';
    // // Get service configuration
    // const blobStorageConfig = botConfig.findServiceByNameOrId(STORAGE_CONFIGURATION_ID);
    // const blobStorage = new BlobStorage({
    //     containerName: (blobStorageConfig.container || DEFAULT_BOT_CONTAINER),
    //     storageAccountOrConnectionString: blobStorageConfig.connectionString,
    // });
    // conversationState = new ConversationState(blobStorage);
    // userState = new UserState(blobStorage);

  }
  get conversationState(): ConversationState {
    return this._conversationState;
  }

  get userState(): UserState {
    return this._userState;
  }

  loadLocalEnvironmentVariables(){
    const ENV_FILE = path.join(__dirname, '..', '.env');
    config({ path: ENV_FILE });
  }

  getEnvironmentVariable(name: string, required: boolean = true){
    let value = process.env[name];
    if(required && !value){
      throw new Error(`missing environment variable ${name}`);
    }
    return value;
  }

  get luisRecognizer(): LuisRecognizer {
    if(!this._luisRecognizer){
      this.configureLuisRecognizer();
    }
    return this._luisRecognizer;
  }
  configureLuisRecognizer(){
    this._luisRecognizer = new LuisRecognizer({
      applicationId: this.getEnvironmentVariable("LuisAppId"),
      endpoint: this.getEnvironmentVariable("LuisAPIHostName"),
      endpointKey: this.getEnvironmentVariable("LuisAPIKey"),
    });
  }
  
}