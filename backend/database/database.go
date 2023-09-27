package database

import (
	"context"
	"log"
	"time"

	"github.com/kshitiz-shresth/go-graphql/graph/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DB struct {
	client *mongo.Client
}

func Connect() *DB {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb+srv://erkshitizshrestha:WgrfamQ8MM0Kk5pE@mbocluster.rryr7kh.mongodb.net/"))
	if err != nil {
		log.Fatal(err)
	}
	return &DB{
		client: client,
	}
}

func (db *DB) Save(input *model.NewUser) *model.User {
	collection := db.client.Database("mbo").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res, err := collection.InsertOne(ctx, input)
	if err != nil {
		log.Fatal(err)
	}
	return &model.User{
		ID:       res.InsertedID.(primitive.ObjectID).Hex(),
		Name:     input.Name,
		Email:    input.Email,
		IsActive: input.IsActive,
	}
}

type RamroUser struct {
	ID       primitive.ObjectID `json:"_id" bson:"_id"`
	Name     string             `json:"name"`
	Email    string             `json:"email"`
	IsActive bool               `json:"IsActive"`
}

func (db *DB) FindByID(ID string) *model.User {
	ObjectID, err := primitive.ObjectIDFromHex(ID)
	collection := db.client.Database("mbo").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res := collection.FindOne(ctx, bson.M{"_id": ObjectID})
	if err != nil {
		log.Fatal(err)
	}
	dog := RamroUser{}
	res.Decode(&dog)
	newUser := model.User{
		ID:       dog.ID.Hex(),
		Name:     dog.Name,
		Email:    dog.Email,
		IsActive: dog.IsActive,
	}
	return &newUser
}

func (db *DB) All() []*model.User {
	collection := db.client.Database("mbo").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	cur, err := collection.Find(ctx, bson.D{})
	if err != nil {
		log.Fatal(err)
	}
	var users []*model.User
	for cur.Next(ctx) {
		var dog *RamroUser
		err := cur.Decode(&dog)
		if err != nil {
			log.Fatal(err)
		}
		users = append(users, &model.User{
			ID:       dog.ID.Hex(),
			Name:     dog.Name,
			Email:    dog.Email,
			IsActive: dog.IsActive,
		})
	}
	return users
}
