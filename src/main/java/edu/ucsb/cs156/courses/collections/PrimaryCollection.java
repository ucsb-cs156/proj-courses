package edu.ucsb.cs156.courses.collections;

import edu.ucsb.cs156.courses.documents.Primary;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrimaryCollection extends MongoRepository<Primary, ObjectId> {}
