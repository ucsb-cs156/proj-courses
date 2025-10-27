# UCSB Courses Search Application

UCSB Courses Search is a Spring Boot Java application with a React frontend that provides course search functionality for UCSB students and staff. The backend uses Google OAuth for authentication and supports both H2 (development) and PostgreSQL (production) databases with MongoDB for course data storage.

**ALWAYS follow these instructions first and fallback to additional search and context gathering only if the information here is incomplete or found to be in error.**

## Working Effectively

### Prerequisites and Environment Setup
- **Java 21 is REQUIRED**. Set environment variables:
  ```bash
  export JAVA_HOME=/usr/lib/jvm/temurin-21-jdk-amd64
  export PATH=$JAVA_HOME/bin:$PATH
  ```
- **Node.js v20.17.0 is REQUIRED** (current v20.19.4 works with warnings)
- **Maven 3.9+** for backend builds
- **OAuth setup is REQUIRED** for local development - copy `.env.SAMPLE` to `.env` and configure Google OAuth credentials

### Backend Build and Test Commands
- **BOOTSTRAP**: `mvn clean compile` - **NEVER CANCEL: Takes ~45 seconds. Set timeout to 90+ seconds.**
- **BUILD**: `mvn clean package -DskipTests` - **NEVER CANCEL: Takes ~20 seconds. Set timeout to 60+ seconds.**
- **TESTS**: `mvn test` - **NEVER CANCEL: Takes ~50 seconds. Set timeout to 120+ seconds.**
- **VALIDATE/FORMAT**: `mvn validate` - **Takes ~2 seconds.**
- **PITEST (single class)**: `mvn pitest:mutationCoverage -DtargetClasses=edu.ucsb.cs156.courses.services.jobs.JobService` - **NEVER CANCEL: Takes ~2 minutes. Set timeout to 180+ seconds.**
- **PITEST (full)**: `mvn pitest:mutationCoverage` - **NEVER CANCEL: May take 15+ minutes. Set timeout to 1200+ seconds.**

### Frontend Build and Test Commands
- **SETUP**: `cd frontend && npm install` - **NEVER CANCEL: Takes ~1 minute. Set timeout to 300+ seconds.**
- **BUILD**: `npm run build` - **NEVER CANCEL: Takes ~25 seconds. Set timeout to 120+ seconds.**
- **TESTS**: `npm test -- --coverage --watchAll=false` - **NEVER CANCEL: Takes ~22 seconds. Set timeout to 120+ seconds.**
- **FORMAT CHECK**: `npm run check-format` - **Takes ~3 seconds.**
- **FORMAT**: `npm run format` - **Takes ~3 seconds.**

### Running Applications
- **Backend**: `mvn spring-boot:run` - **MongoDB network issues in sandboxed environments prevent full startup**
- **Frontend**: `cd frontend && npm start` - **Available at http://localhost:3000**
- **Storybook**: `cd frontend && npm run storybook` - **Available at http://localhost:6006**

### OAuth Configuration for Local Development
```bash
cp .env.SAMPLE .env
# Edit .env file with real Google OAuth credentials:
# GOOGLE_CLIENT_ID=your-client-id
# GOOGLE_CLIENT_SECRET=your-client-secret
# ADMIN_EMAILS=your-email@ucsb.edu
# UCSB_API_KEY=your-api-key
```

## Validation

### Manual Testing Requirements
- **ALWAYS manually validate changes by running the frontend and viewing in browser**
- **Frontend runs successfully** at http://localhost:3000 (shows waiting for backend when backend unavailable)
- **Storybook runs successfully** at http://localhost:6006 
- **Backend fails to start in sandboxed environments** due to MongoDB download restrictions (network blocked)
- **ALWAYS run format and validation** before completing: `npm run format && npm run check-format && mvn validate`
- **Test scenarios**: Course search form functionality, navigation, responsive design

### Critical Limitations in Sandboxed Environments
- **MongoDB embedded server cannot download** in restricted network environments
- **Backend startup will fail** with `java.net.UnknownHostException: fastdl.mongodb.org` 
- **OAuth requires real credentials** - fake values prevent proper authentication flow
- **API calls will fail** without valid UCSB_API_KEY

## Common Tasks

### Repository Structure
```
/home/runner/work/proj-courses/proj-courses/
├── README.md                 # Main documentation
├── pom.xml                   # Maven configuration
├── .env.SAMPLE               # Environment template
├── frontend/                 # React application
│   ├── package.json          # Frontend dependencies
│   ├── src/                  # Source code
│   └── public/               # Static assets
├── src/main/java/            # Backend Java source
├── src/test/java/            # Backend tests
├── docs/                     # Documentation
│   ├── oauth.md              # OAuth setup guide
│   ├── dokku.md              # Deployment guide
│   └── github-pages.md       # GitHub Pages setup
└── .github/workflows/        # CI/CD workflows
```

### Key Backend Components
- **Main Application**: `src/main/java/edu/ucsb/cs156/courses/CoursesApplication.java`
- **Controllers**: `src/main/java/edu/ucsb/cs156/courses/controllers/`
- **Services**: `src/main/java/edu/ucsb/cs156/courses/services/`
- **Configuration**: `src/main/resources/application-development.properties`

### Key Frontend Components  
- **Main App**: `frontend/src/App.js`
- **Pages**: `frontend/src/main/pages/`
- **Components**: `frontend/src/main/components/`
- **Tests**: `frontend/src/tests/`

### Typical Development Workflow
1. **Bootstrap environment**: Set Java 21, install frontend dependencies
2. **Setup OAuth**: Copy `.env.SAMPLE` to `.env`, configure credentials
3. **Build backend**: `mvn clean compile` (45 seconds)
4. **Test backend**: `mvn test` (50 seconds) 
5. **Build frontend**: `cd frontend && npm install && npm run build` (1-2 minutes total)
6. **Test frontend**: `npm test -- --coverage --watchAll=false` (22 seconds)
7. **Format code**: `npm run format && mvn validate`
8. **Run applications**: Start frontend with `npm start`, attempt backend with `mvn spring-boot:run`

### Important Files to Check After Changes
- **Always run linting**: `npm run check-format` for frontend, `mvn validate` for backend
- **Check API contracts**: Review changes in `src/main/java/edu/ucsb/cs156/courses/controllers/`
- **Update tests**: Add/modify tests in corresponding `src/test/` directories
- **Documentation**: Update README.md if adding new features or changing setup

### Build Times Summary
| Command | Time | Timeout Recommendation |
|---------|------|----------------------|
| `mvn clean compile` | ~45s | 90s+ |
| `mvn test` | ~50s | 120s+ |
| `npm install` | ~70s | 300s+ |
| `npm run build` | ~25s | 120s+ |
| `npm test` | ~22s | 120s+ |
| `mvn pitest:mutationCoverage` (single) | ~2m | 180s+ |

**REMEMBER**: NEVER CANCEL long-running commands. Builds and tests can take several minutes to complete successfully.