<div class="user-info">
                <div class="image">
                    <img src="../../images/user.png" width="48" height="48" alt="User" />
                </div>
                <div class="info-container">
                    <div class="name" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <?php echo $objAcceso->getUsuario(); ?>
                    </div>
                    <div class="email"><?php echo $objAcceso->getCorreo(); ?></div>
                </div>
            </div>