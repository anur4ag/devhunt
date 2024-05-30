# DevHunt

DevHunt is a project created using Bun, a fast all-in-one JavaScript runtime. This README provides instructions on how to set up and run the project.

## Prerequisites

Before you begin, ensure you have installed:

- [Bun](https://bun.sh) v1.1.7 or later

## Installation

Follow these steps to install the project dependencies:

1. Install the root dependencies:

  ```bash
  bun install
  ```

2. Navigate to the `frontend` directory and install its dependencies:

  ```bash
  cd frontend && bun install
  ```

3. Change the name of `.example.env` to `.env` and populate it with the PostgreSQL database URL, and Kinde Credentials.

## Running the Project

To run the project, use the following command in the root directory:

```bash
bun dev
