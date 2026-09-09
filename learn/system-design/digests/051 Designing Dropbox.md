---
source: 051 Designing Dropbox
source_lines: 440
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 051 Designing Dropbox

## Overview (L1)

- ');--focus-highlight-color:#a5d8ff;--icon-fill-color:var(--color-on-surface);--icon-green-fill-color:#2b8a3e;--default-bg-color:#fff;--input-bg-color:#fff;--input-border-color:#ced4da;--input-hover-bg
- Vote For New Content​Introduction to System Design InterviewWhat is a System Design Interview?Functional vs. Non-functional RequirementsWhat are Back-of-the-Envelope Estimations?Things to Avoid During
- Why Cloud Storage?
Try it yourself
- Cloud file storage services have become very popular recently as they simplify the storage and exchange of digital resources among multiple devices. The shift from using single personal computers to u

## Sections (L2)

### 1. Why Cloud Storage?

- Locator: `[[sources/system-design/completed/20260825_051 Designing Dropbox.html#h2-1-why-cloud-storage]]`
- Summary: Cloud file storage services have become very popular recently as they simplify the storage and exchange of digital resources among multiple devices. The shift from using single personal computers to using multiple devices with different platforms and operating systems such as smartphones and tablets each with portable access from various geographical locations at any time, is believed to be accoun
- Key claims: See summary
- Learner-relevant: Core system design concept

### Try it yourself

- Locator: `[[sources/system-design/completed/20260825_051 Designing Dropbox.html#h3-try-it-yourself]]`
- Summary: Before looking at the solution, try designing it: To move canvas, hold mouse wheel or spacebar while dragging, or use the hand tool
- Key claims: See summary
- Learner-relevant: Core system design concept

### Canvas actions

- Locator: `[[sources/system-design/completed/20260825_051 Designing Dropbox.html#0Kc2vYMhd6zSlezSlPhSK-canvasActions-title]]`
- Summary: 100% Saved to cloud Exit zen mode Drawing canvas
- Key claims: See summary
- Learner-relevant: Core system design concept

### Designing Dropbox (video)

- Locator: `[[sources/system-design/completed/20260825_051 Designing Dropbox.html#h3-designing-dropbox-video]]`
- Summary: Here is a video discussing how to design Dropbox: Designing Dropbox
- Key claims: Here is a video discussing how to design Dropbox: Designing Dropbox
- Learner-relevant: Core system design concept

### 2. Requirements and Goals of the System

- Locator: `[[sources/system-design/completed/20260825_051 Designing Dropbox.html#h2-2-requirements-and-goals-of-the-system]]`
- Summary: What do we wish to achieve from a Cloud Storage system? Here are the top-level requirements for our system: Users should be able to upload and download their files/photos from any device. Users should be able to share files or folders with other users. Our service should support automatic synchronization between devices, i.e., after updating a file on one device, it should get synchronized on all 
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Some Design Considerations

- Locator: `[[sources/system-design/completed/20260825_051 Designing Dropbox.html#h2-3-some-design-considerations]]`
- Summary: We should expect huge read and write volumes. Read to write ratio is expected to be nearly the same. Internally, files can be stored in small parts or chunks (say 4MB); this can provide a lot of benefits i.e. all failed operations shall only be retried for smaller parts of a file. If a user fails to upload a file, then only the failing chunk will be retried. We can reduce the amount of data exchan
- Key claims: See summary
- Learner-relevant: Core system design concept

### 4. Capacity Estimation and Constraints

- Locator: `[[sources/system-design/completed/20260825_051 Designing Dropbox.html#h2-4-capacity-estimation-and-constraints]]`
- Summary: Let’s assume that we have 500M total users, and 100M daily active users (DAU). Let’s assume that on average each user connects from three different devices. On average if a user has 200 files/photos, we will have 100 billion total files. Let’s assume that average file size is 100KB, this would give us ten petabytes of total storage. 100B * 100KB => 10PB Let’s also assume that we will have one mill
- Key claims: See summary
- Learner-relevant: Core system design concept

### 5. High Level Design

- Locator: `[[sources/system-design/completed/20260825_051 Designing Dropbox.html#h2-5-high-level-design]]`
- Summary: The user will specify a folder as the workspace on their device. Any file/photo/folder placed in this folder will be uploaded to the cloud, and whenever a file is modified or deleted, it will be reflected in the same way in the cloud storage. The user can specify similar workspaces on all their devices and any modification done on one device will be propagated to all other devices to have the same
- Key claims: See summary
- Learner-relevant: Core system design concept

### 6. Component Design

- Locator: `[[sources/system-design/completed/20260825_051 Designing Dropbox.html#h2-6-component-design]]`
- Summary: Let's go through the major components of our system one by one:
- Key claims: See summary
- Learner-relevant: Core system design concept

### a. Client

- Locator: `[[sources/system-design/completed/20260825_051 Designing Dropbox.html#h3-a-client]]`
- Summary: The Client Application monitors the workspace folder on the user's machine and syncs all files/folders in it with the remote Cloud Storage. The client application will work with the storage servers to upload, download, and modify actual files to backend Cloud Storage. The client also interacts with the remote Synchronization Service to handle any file metadata updates, e.g., change in the file nam
- Key claims: See summary
- Learner-relevant: Core system design concept

### b. Metadata Database

- Locator: `[[sources/system-design/completed/20260825_051 Designing Dropbox.html#h3-b-metadata-database]]`
- Summary: The Metadata Database is responsible for maintaining the versioning and metadata information about files/chunks, users, and workspaces. The Metadata Database can be a relational database such as MySQL or a NoSQL database service such as DynamoDB. Regardless of the type of the database, the Synchronization Service should be able to provide a consistent view of the files using a database, especially
- Key claims: See summary
- Learner-relevant: Core system design concept

### c. Synchronization Service

- Locator: `[[sources/system-design/completed/20260825_051 Designing Dropbox.html#h3-c-synchronization-service]]`
- Summary: The Synchronization Service is the component that processes file updates made by a client and applies these changes to other subscribed clients. It also synchronizes clients' local databases with the information stored in the remote Metadata DB. The Synchronization Service is the most important part of the system architecture due to its critical role in managing the metadata and synchronizing user
- Key claims: See summary
- Learner-relevant: Core system design concept

### d. Message Queuing Service

- Locator: `[[sources/system-design/completed/20260825_051 Designing Dropbox.html#h3-d-message-queuing-service]]`
- Summary: An important part of our architecture is a messaging middleware that should be able to handle a substantial number of requests. A scalable Message Queuing Service that supports asynchronous message-based communication between clients and the Synchronization Service best fits the requirements of our application. The Message Queuing Service supports asynchronous and loosely coupled message-based com
- Key claims: An important part of our architecture is a messaging middleware that should be able to handle a substantial number of requests; The Request Queue is a global queue and all clients will share it
- Learner-relevant: Core system design concept

### e. Cloud/Block Storage

- Locator: `[[sources/system-design/completed/20260825_051 Designing Dropbox.html#h3-e-cloudblock-storage]]`
- Summary: Cloud/Block Storage stores chunks of files uploaded by the users. Clients directly interact with the storage to send and receive objects from it. Separation of the metadata from storage enables us to use any storage either in the cloud or in-house. Detailed component design for Dropbox
- Key claims: See summary
- Learner-relevant: Core system design concept

### 7. File Processing Workflow

- Locator: `[[sources/system-design/completed/20260825_051 Designing Dropbox.html#h2-7-file-processing-workflow]]`
- Summary: The sequence below shows the interaction between the components of the application in a scenario when Client A updates a file that is shared with Client B and C, so they should receive the update too. If the other clients are not online at the time of the update, the Message Queuing Service keeps the update notifications in separate response queues for them until they come online later. Client A u
- Key claims: See summary
- Learner-relevant: Core system design concept

