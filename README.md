# Sanish - SANE Interface Shell

[![GitHub stars](https://img.shields.io/github/stars/shintopc/sanish)](https://github.com/shintopc/sanish/stargazers)
[![GitHub license](https://img.shields.io/github/license/shintopc/sanish)](https://github.com/shintopc/sanish/blob/main/LICENSE)

## Overview

Sanish is a SANE (Scanner Access Now Easy) interface shell that provides a command-line interface for scanner devices. It's designed to be a lightweight alternative to graphical scanner interfaces.

## Features

- Command-line scanner control
- Supports all SANE-compatible scanners
- Batch scanning capabilities
- Scriptable interface for automation
- Lightweight and fast

## Installation

### Prerequisites
- SANE backend installed
- Scanner properly configured and detected by SANE

### Installation Methods

1. **From source**:
   ```bash
   git clone https://github.com/shintopc/sanish.git
   cd sanish
   make
   sudo make install
