# MarketplaceBE
#
MVP:

As a user, I can view a list of available items.
As a user, I can view a list of items for a particular category.
As a user, I can list an item to sell.



#
As a user, I can view a list of available items.
As a user, I can view a list of items for a particular category.
As a user, I can list an item to sell.
As a user, I can order an item.
As a user, I can delete an item listing if I change my mind.
As a user, I can view which items I have previously ordered.
As a user, I can give another user kudos to provide feedback.
As a user, I can add an item to my basket to order later if I am still browsing.
As a user, I can view which items I have added to my basket.
As a user, I can remove items from my basket.
As a user, I can create a new user profile.


# 
+-----------+       +--------------+       +------------+
|  Users    |       |  Articles    |       | Categories |
+-----------+       +--------------+       +------------+
| id        |◄──────| user_id      |       | id         |
| name      |       | id           |──────►| name       |
| email     |       | title        |       +------------+
| password  |       | description  |
| created_at|       | price        |
+-----------+       | category_id  |
                    | image_url    |
                    | created_at   |
                    +--------------+

        ▲
        │
+------------------+
|  Basket_Items    |
+------------------+
| id               |
| user_id          |
| article_id       |
| quantity         |
| added_at         |
+------------------+
