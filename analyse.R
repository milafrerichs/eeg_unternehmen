library(plyr)
d <- read.csv("eeg.csv")
u <- d[!duplicated(d[,c('abnahmestelle')]),]
branche_bundesland <- ddply(u, .(bundesland, branche), summarise, 
                N    = length(abnahmestelle))