# logger module

import io
import logging
import sys

# Logger setup =============================================

# custom logger, logs only when called from this project
# gets set up in setupLoggers()
log = None

logFormat = "[%(levelname)s] %(asctime)s (%(name)s): %(message)s"

# open log files in append mode
logMode = "a"

# location of logs created by the discord.py framework
discordPyLogs = "logs/discord.txt"

# location of logs created by project
botLogs = "logs/bot.txt"

# setup a logger to receive framework log messages
# the level is set to WARN - this will only log 
# error and warning messages
logging.basicConfig(filename=discordPyLogs,
                    filemode=logMode,
                    format=logFormat,
                    level=logging.WARN)

# this will reroute stderr to the project log file
class ErrorStream(io.IOBase):
    def write(self, s):
        log.error(s)

# create a logger
def createLogger(name: str, file: str, level=logging.DEBUG):
    logger = logging.getLogger(name)
    formatter = logging.Formatter(logFormat)
    fileHandler = logging.FileHandler(file, logMode)
    fileHandler.setFormatter(formatter)
    streamHandler = logging.StreamHandler()
    streamHandler.setFormatter(formatter)
    logger.setLevel(level)
    logger.addHandler(fileHandler)
    logger.propagate = False

# setup the project logger
def setupLoggers():
    botLoggerName = "Local"
    createLogger(botLoggerName, botLogs)
    global log
    log = logging.getLogger(botLoggerName)
    # reroute stderr to project log file
    sys.stderr = ErrorStream()
