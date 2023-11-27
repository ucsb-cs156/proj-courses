package edu.ucsb.cs156.courses.collections;

import edu.ucsb.cs156.courses.documents.Update;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UpdateCollection extends MongoRepository<Update, ObjectId> {}
