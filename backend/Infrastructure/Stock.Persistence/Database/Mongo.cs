using System;
using MongoDB.Driver;
using Stock.Domain.Entities.Interfaces;
using Stock.Utilities.Extensions;

namespace Stock.Persistence.Database
{
    public static class Mongo
    {
        private static string _connection;
        private static string _database;

        public static void Initialize(string connection, string database, Action<IMongoDatabase> action = null)
        {
            _connection = connection;
            _database = database;
            if (action.SafeNotEquals(default))
            {
                action(GetDatabase());
            }
        }

        public static void GetCollection<TEntity>(this IMongoDatabase database, string collectionName, Action<IMongoCollection<TEntity>> indexAction = null)
        {
            var collection = database.GetCollection<TEntity>(collectionName);
            if (indexAction.SafeNotEquals(default))
            {
                indexAction(collection);
            }
        }

        public static void DefineIndex<TEntity>(
            this IMongoCollection<TEntity> collection,
            string indexName,
            bool unique,
            Func<IndexKeysDefinitionBuilder<TEntity>, IndexKeysDefinition<TEntity>> definitionBuilderAction,
            bool sparse = true
        ) where TEntity : class, IEntity
        {
            var options = GetIndexOptions(indexName, unique, sparse);
            var model = GetIndexModel(definitionBuilderAction, options);
            AddIndex(collection, model);
        }

        private static IMongoDatabase GetDatabase()
        {
            var client = new MongoClient($"{_connection}");
            
            return client.GetDatabase(_database);
        }

        private static CreateIndexOptions GetIndexOptions(string indexName, bool unique, bool sparse)
        {
            return new CreateIndexOptions
            {
                Name = indexName,
                Unique = unique,
                Sparse = sparse
            };
        }

        private static CreateIndexModel<TEntity> GetIndexModel<TEntity>(
            Func<IndexKeysDefinitionBuilder<TEntity>, IndexKeysDefinition<TEntity>> definitionBuilderAction,
            CreateIndexOptions indexOptions
        )
        {
            var definitionBuilder = Builders<TEntity>.IndexKeys;
            var indexKeys = definitionBuilderAction(definitionBuilder);
            
            return new CreateIndexModel<TEntity>(indexKeys, indexOptions);
        }

        private static void AddIndex<TEntity>(IMongoCollection<TEntity> collection, CreateIndexModel<TEntity> indexModel)
        {
            collection.Indexes.CreateOne(indexModel);
        }
    }
}
