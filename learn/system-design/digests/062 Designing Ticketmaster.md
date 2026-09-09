---
source: 062 Designing Ticketmaster
source_lines: 524
created: 2025-08-25
updated: 2025-08-25
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — 062 Designing Ticketmaster

## Overview (L1)

- ');--focus-highlight-color:#a5d8ff;--icon-fill-color:var(--color-on-surface);--icon-green-fill-color:#2b8a3e;--default-bg-color:#fff;--input-bg-color:#fff;--input-border-color:#ced4da;--input-hover-bg
- Vote For New Content​Introduction to System Design InterviewWhat is a System Design Interview?Functional vs. Non-functional RequirementsWhat are Back-of-the-Envelope Estimations?Things to Avoid During
- What is an online movie ticket booking system?
Try it yourself
- A movie ticket booking system provides its customers the ability to purchase theatre seats online. E-ticketing systems allow the customers to browse through movies currently being played and to book s

## Sections (L2)

### 1. What is an online movie ticket booking system?

- Locator: `[[sources/system-design/completed/20260825_062 Designing Ticketmaster.html#h2-1-what-is-an-online-movie-ticket-booking-system]]`
- Summary: A movie ticket booking system provides its customers the ability to purchase theatre seats online. E-ticketing systems allow the customers to browse through movies currently being played and to book seats, anywhere anytime.
- Key claims: A movie ticket booking system provides its customers the ability to purchase theatre seats online
- Learner-relevant: Core system design concept

### Try it yourself

- Locator: `[[sources/system-design/completed/20260825_062 Designing Ticketmaster.html#h3-try-it-yourself]]`
- Summary: Before looking at the solution, try designing it: To move canvas, hold mouse wheel or spacebar while dragging, or use the hand tool
- Key claims: See summary
- Learner-relevant: Core system design concept

### Canvas actions

- Locator: `[[sources/system-design/completed/20260825_062 Designing Ticketmaster.html#nUKugziRnwQ6AYAY9CdF--canvasActions-title]]`
- Summary: 100% Saved to cloud Exit zen mode Drawing canvas
- Key claims: See summary
- Learner-relevant: Core system design concept

### Designing Ticketmaster (video)

- Locator: `[[sources/system-design/completed/20260825_062 Designing Ticketmaster.html#h3-designing-ticketmaster-video]]`
- Summary: Here is a video discussing how to design Ticketmaster: Designing Ticketmaster
- Key claims: Here is a video discussing how to design Ticketmaster: Designing Ticketmaster
- Learner-relevant: Core system design concept

### 2. Requirements and Goals of the System

- Locator: `[[sources/system-design/completed/20260825_062 Designing Ticketmaster.html#h2-2-requirements-and-goals-of-the-system]]`
- Summary: Our ticket booking service should meet the following requirements: Functional Requirements: Our ticket booking service should be able to list different cities where its affiliate cinemas are located. Once the user selects the city, the service should display the movies released in that particular city. Once the user selects a movie, the service should display the cinemas running that movie and its
- Key claims: See summary
- Learner-relevant: Core system design concept

### 3. Some Design Considerations

- Locator: `[[sources/system-design/completed/20260825_062 Designing Ticketmaster.html#h2-3-some-design-considerations]]`
- Summary: For simplicity, let’s assume our service does not require any user authentication. The system will not handle partial ticket orders. Either user gets all the tickets they want or they get nothing. Fairness is mandatory for the system. To stop system abuse, we can restrict users from booking more than ten seats at a time. We can assume that traffic would spike on popular/much-awaited movie releases
- Key claims: See summary
- Learner-relevant: Core system design concept

### 4. Capacity Estimation

- Locator: `[[sources/system-design/completed/20260825_062 Designing Ticketmaster.html#h2-4-capacity-estimation]]`
- Summary: Traffic estimates: Let’s assume that our service has 3 billion page views per month and sells 10 million tickets a month. Storage estimates: Let’s assume that we have 500 cities and, on average each city has ten cinemas. If there are 2000 seats in each cinema and on average, there are two shows every day. Let’s assume each seat booking needs 50 bytes (IDs, NumberOfSeats, ShowID, MovieID, SeatNumbe
- Key claims: See summary
- Learner-relevant: Core system design concept

### 5. System APIs

- Locator: `[[sources/system-design/completed/20260825_062 Designing Ticketmaster.html#h2-5-system-apis]]`
- Summary: We can have SOAP or REST APIs to expose the functionality of our service. The following could be the definition of the APIs to search movie shows and reserve seats. SearchMovies ( api_dev_key , keyword , city , lat_long , radius , start_datetime , end_datetime , postal_code , includeSpellcheck , results_per_page , sorting_order ) Parameters: api_dev_key (string): The API developer key of a registe
- Key claims: See summary
- Learner-relevant: Core system design concept

### 6. Database Design

- Locator: `[[sources/system-design/completed/20260825_062 Designing Ticketmaster.html#h2-6-database-design]]`
- Summary: Here are a few observations about the data we are going to store: Each City can have multiple Cinemas. Each Cinema will have multiple halls. Each Movie will have many Shows and each Show will have multiple Bookings. A user can have multiple bookings. DB Schema
- Key claims: See summary
- Learner-relevant: Core system design concept

### 7. High Level Design

- Locator: `[[sources/system-design/completed/20260825_062 Designing Ticketmaster.html#h2-7-high-level-design]]`
- Summary: At a high-level, our web servers will manage users’ sessions and application servers will handle all the ticket management, storing data in the databases as well as working with the cache servers to process reservations. High Level Design
- Key claims: See summary
- Learner-relevant: Core system design concept

### 8. Detailed Component Design

- Locator: `[[sources/system-design/completed/20260825_062 Designing Ticketmaster.html#h2-8-detailed-component-design]]`
- Summary: First, let’s try to build our service assuming it is being served from a single server. Ticket Booking Workflow: The following would be a typical ticket booking workflow: The user searches for a movie. The user selects a movie. The user is shown the available shows of the movie. The user selects a show. The user selects the number of seats to be reserved. If the required number of seats are availa
- Key claims: See summary
- Learner-relevant: Core system design concept

### a. ActiveReservationsService

- Locator: `[[sources/system-design/completed/20260825_062 Designing Ticketmaster.html#h3-a-activereservationsservice]]`
- Summary: We can keep all the reservations of a 'show' in memory in a data structure similar to Linked HashMap or a TreeMap in addition to keeping all the data in the database. We will need a linked HashMap kind of data structure that allows us to jump to any reservation to remove it when the booking is complete. Also, since we will have expiry time associated with each reservation, the head of the HashMap 
- Key claims: We will need a linked HashMap kind of data structure that allows us to jump to any reservation to remove it when the booking is complete
- Learner-relevant: Core system design concept

### b. WaitingUsersService

- Locator: `[[sources/system-design/completed/20260825_062 Designing Ticketmaster.html#h3-b-waitingusersservice]]`
- Summary: Just like ActiveReservationsService, we can keep all the waiting users of a show in memory in a Linked HashMap or a TreeMap. We need a data structure similar to Linked HashMap so that we can jump to any user to remove them from the HashMap when the user cancels their request. Also, since we are serving in a first-come-first-serve manner, the head of the Linked HashMap would always be pointing to t
- Key claims: See summary
- Learner-relevant: Core system design concept

### 9. Concurrency

- Locator: `[[sources/system-design/completed/20260825_062 Designing Ticketmaster.html#h2-9-concurrency]]`
- Summary: How to handle concurrency, such that no two users are able to book the same seat. We can use transactions in SQL databases to avoid any clashes. For example, if we are using an SQL server we can utilize Transaction Isolation Levels to lock the rows before we can update them. Here is the sample code: SET TRANSACTION ISOLATION LEVEL SERIALIZABLE ; BEGIN TRANSACTION ; -- Suppose we intend to reserve 
- Key claims: See summary
- Learner-relevant: Core system design concept

### 10. Fault Tolerance

- Locator: `[[sources/system-design/completed/20260825_062 Designing Ticketmaster.html#h2-10-fault-tolerance]]`
- Summary: What happens when ActiveReservationsService or WaitingUsersService crashes? Whenever ActiveReservationsService crashes, we can read all the active reservations from the ‘Booking’ table. Remember that we keep the ‘Status’ column as ‘Reserved (1)’ until a reservation gets booked. Another option is to have a primary-secondary configuration so that, when the primary crashes, the secondary can take ove
- Key claims: See summary
- Learner-relevant: Core system design concept

